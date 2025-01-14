export interface boardType{
    id:number,
    title:string
    tasks:Array<taskType>
}

export interface taskType{
    id:number,
    title:string,
    description:string
}
