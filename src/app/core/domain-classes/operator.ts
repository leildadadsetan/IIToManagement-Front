

export class UnitOperator {
    id: number;
    name: string;
}
export enum Operators {
    Plush,
    Minus,
    Multiply,
    Divide
}

export const unitOperators: UnitOperator[] = [
    {
        id: 0,
        name: 'Plush'
    }, {
        id: 1,
        name: 'Minus'
    }, {
        id: 2,
        name: 'Multiply'
    },
    {
        id: 3,
        name: 'Divide'
    },
];