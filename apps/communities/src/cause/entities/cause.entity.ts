import { CauseStatus } from "./cause-status.enum";

export class CauseEntity {

      id: string;

      title: string;
    
      description: string;
    
      creationDate: Date;

      endDate: Date;
    
      community: string;
    
      actions: string[];
    
      events: string[];
    
      registeredSupporters: number[];
    
      status: CauseStatus;

      category: string;
        
      keywords: string[];
        
      location: string;
}
