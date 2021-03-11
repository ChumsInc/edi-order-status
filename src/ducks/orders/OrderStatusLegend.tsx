import * as React from "react";

const OrderStatusLegend: React.FC = () => {
    return (
        <div className="status-button-select--legend">
            <button type="button" className="btn btn-light me-1">No Status</button>
            <button type="button" className="btn btn-info me-1">In Process</button>
            <button type="button" className="btn btn-success me-1">Done</button>
            <button type="button" className="btn btn-warning me-1">Waiting</button>
            <button type="button" className="btn btn-danger me-1">On Hold</button>
            <button type="button" className="btn btn-dark me-1">N/A</button>
        </div>
    )
}
export default OrderStatusLegend;
