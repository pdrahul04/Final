import type React from "react";

interface EmptyStateProps {
    title: string;
    description: string;
}
export const EmptyState: React.FC<EmptyStateProps> = ( {title, description} ) => {
    return(<div>
        <h1>Comming Soon: {title} and {description}</h1>
    </div>)
}