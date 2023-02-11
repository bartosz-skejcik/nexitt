import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method == "DELETE") {
        const { imageName } = req.body;

        // delete the file from /public/postImages using fs
        fs.unlink(`./public/postImages/${imageName}`, (err) => {
            if (err) {
                console.error(err);
                return;
            }
        });
        // return success or error
        res.status(200).json({ message: "Image deleted successfully" });
    }
}
