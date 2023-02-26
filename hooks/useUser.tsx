import axios from "axios";
import { useEffect, useState } from "react";

export default function useUser(id: number) {
    const [user, setUser] = useState<User | null>();
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);
            try {
                const response = await axios.get(
                    `http://localhost:8080/users/${id}`
                );
                setUser(response.data);
            } catch (error: any) {
                setError(error.message);
            }
            setLoading(false);
        };
        fetchUser();
    }, [id]);

    return { user, error, loading };
}
