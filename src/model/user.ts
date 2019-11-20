export enum EUserTeam {
    red,
    black,
}

export interface IUser {
    uuid?: string;
    name?: string;
    team?: EUserTeam;
    posY?: number;
}


export class User {

    public uuid: string;
    public name: string;
    public team: EUserTeam;
    public posY: number;


    constructor(user: IUser) {
        this.uuid = user.uuid;
        this.name = user.name;
        this.team = user.team;
        this.posY = user.posY;
    }

}
