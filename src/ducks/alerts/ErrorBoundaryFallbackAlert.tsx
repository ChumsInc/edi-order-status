import type {FallbackProps} from "react-error-boundary";
import Alert from "react-bootstrap/Alert";

export default function ErrorBoundaryFallbackAlert({error, resetErrorBoundary}: FallbackProps) {
    if (error instanceof Error) {
        return (
            <Alert variant="danger" dismissible onClose={resetErrorBoundary}>
                <strong>Something went wrong!</strong>
                <div>
                    {error.message}
                </div>
            </Alert>
        )
    }

    return (
        <Alert variant="danger" dismissible onClose={resetErrorBoundary}>
            <strong>Something went wrong!</strong>
            <div className="text-light">Unknown Error</div>
        </Alert>
    )
}
