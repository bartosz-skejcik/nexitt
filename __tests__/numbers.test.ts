import { shortenTheBigNumbers } from "../lib/numbers.helper";

describe("shortenTheBigNumbers", () => {
    it("should return 1.2k", () => {
        const result = shortenTheBigNumbers(1234);
        expect(result).toBe("1.2k");
    });
    it("should return 8.7m", () => {
        const result = shortenTheBigNumbers(8674567);
        expect(result).toBe("8.7m");
    });
    it("should return 40.1m", () => {
        const result = shortenTheBigNumbers(40134567);
        expect(result).toBe("40.1m");
    });
});
