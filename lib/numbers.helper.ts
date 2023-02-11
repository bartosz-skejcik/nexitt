const shortenTheBigNumbers = (number: number) => {
    return number > 999
        ? number > 9999
            ? number > 99999
                ? `${(number / 1000000).toFixed(1)}m`
                : `${(number / 1000).toFixed(1)}k`
            : `${(number / 1000).toFixed(1)}k`
        : number;
};

export { shortenTheBigNumbers };
