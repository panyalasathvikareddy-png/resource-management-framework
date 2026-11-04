export interface Resource {
    id?: string;
    name: string;
    skillset: string[];
    primarySkill: string;
    experience: number;
    designation: string;
    resumeName?: string;
    resumeUrl?: string;
    selected?: boolean;
    requested?: boolean;
    allocated?: boolean; // Indicates if the resource is allocated to a project
    
};