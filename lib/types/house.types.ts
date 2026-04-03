export interface House {
    id:string
    name:string
    noOfMembers:number
}
export interface CreateHouseFormData {
    name: string
    noOfMembers: number
    location: string
}