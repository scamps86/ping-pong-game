export type TStringObject = { [key: string]: string };


export const getObjectDeepKeys = (obj: any, prefix = ''): TStringObject => {
    return Object.keys(obj).reduce(
        (current: TStringObject, key: string) => {
            const val: any = obj[key];
            if (typeof val === 'object') {
                const keys: TStringObject = getObjectDeepKeys(val, prefix + key + '.');
                return {
                    ...current,
                    ...keys,
                };
            } else {
                return {
                    ...current,
                    [prefix + key]: val,
                };
            }
        },
        {},
    );
};


export const objectPathToKeys = (path: string, separator = '.'): string[] => {
    return path.split(separator).filter(
        (key: string) => {
            return key !== '';
        });
};


export const objectPick = (path: string, obj: Object): any => {
    const keys: string[] = objectPathToKeys(path);
    return obj && keys.length > 0
        ? keys.reduce(
            (current: any, nextKey: any) => {
                if (typeof current === 'object' && current !== null) {
                    return current[nextKey];
                }
                return current;
            },
            obj,
        )
        : undefined;
};
