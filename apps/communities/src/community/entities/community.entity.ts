export class CommunityEntity {
      id: string;
      
      name: string;

      description: string;

      creationDate: Date;
    
      creator: number;
    
      admins: number[];
    
      members: number[];
   
      causes: string[];
}
