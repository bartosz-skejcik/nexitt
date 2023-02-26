import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth, { NextAuthOptions } from "next-auth";
import { User } from "types/interfaces";
import axios from "axios";

export const authOptions: NextAuthOptions = {
    // Configure one or more authentication providers
    providers: [
        // ...add more providers here
        CredentialsProvider({
            // The name to display on the sign in form (e.g. "Sign in with...")
            name: "Credentials",
            // `credentials` is used to generate a form on the sign in page.
            // You can specify which fields should be submitted, by adding keys to the `credentials` object.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                username: {
                    label: "Username",
                    type: "text",
                    placeholder: "12345657890",
                },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials: any, req: any) {
                const { username, password } = credentials;

                const user = axios
                    .post("http://localhost:8080/api/login", {
                        username,
                        password,
                    })
                    .then((res) => {
                        console.log(res);
                        return res.data;
                    })
                    .catch((err) => {
                        console.log(err);
                        return null;
                    });

                if (user) {
                    return user;
                } else {
                    return null;
                }
            },
        }),
    ],

    callbacks: {
        async signIn({ user, account, profile, email, credentials }) {
            console.log("signIn", user, account, profile, email, credentials);
            return true;
        },
        async jwt({ token, user, account, profile, isNewUser }) {
            console.log("jwt", token, user, account, profile, isNewUser);
            return { ...token, ...user };
        },
        async session({ session, user, token }) {
            console.log("session", session, user, token);
            //@ts-ignore
            session.user = token;
            return session;
        },
    },

    session: {
        strategy: "jwt",
    },

    pages: {
        signIn: "/login",
    },
};

export default NextAuth(authOptions);
