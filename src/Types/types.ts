export interface boardType{
    id:number,
    title:string
}

export interface taskType{
    id:number,
    title:string,
    description:string,
    boardId: number
}
