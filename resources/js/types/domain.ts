export type ProjectStatus = 'active' | 'completed' | 'on-hold';

export type Trade =
    | 'electrical'
    | 'plumbing'
    | 'mep'
    | 'civil'
    | 'finishing'
    | 'structural'
    | 'hvac';

export type Severity = 'low' | 'medium' | 'high' | 'critical';

export type SnagStatus = 'open' | 'in-progress' | 'closed' | 'rejected';

export interface Project {
    id: string;
    name: string;
    client: string;
    location: string;
    start_date: string;
    status: ProjectStatus;
    created_at: string;
    updated_at: string;

    /** Aggregated counts populated by the index controller. */
    snags_count?: number;
    open_count?: number;
    in_progress_count?: number;
    closed_count?: number;

    /** Eager-loaded relations populated by the show controller. */
    snags?: Snag[];
}

export interface Snag {
    id: string;
    project_id: string;
    title: string;
    description: string;
    location: string;
    trade: Trade;
    severity: Severity;
    status: SnagStatus;
    photo_path: string | null;
    assigned_to: string | null;
    due_date: string | null;
    created_at: string;
    updated_at: string;

    project?: Project;
    comments?: Comment[];
}

export interface Comment {
    id: string;
    snag_id: string;
    author: string;
    body: string;
    created_at: string;
    updated_at: string;
}
