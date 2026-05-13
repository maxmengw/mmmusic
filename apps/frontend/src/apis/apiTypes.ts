export interface ApiResponse<T> {
    status: string;
    data?: T;
    message?: string;
    error?: string;
    code?: string;
}