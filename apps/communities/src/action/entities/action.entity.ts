import { Donor } from "./donor.entity";

export class ActionEntity {

    title: string;
    
    description: string;
    
    creationDate: Date;
    
    cause: string;
    
    type: string; 
    
    status: string;
    
    goal: number;
    
    progress: number; 
    
    volunteers: number[];
    
    donors: Donor[];
}
