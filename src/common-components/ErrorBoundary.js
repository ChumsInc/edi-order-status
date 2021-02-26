import React, {Component} from 'react';
import {connect} from 'react-redux';
import Alert from "../ducks/alerts/Alert";

function mapStateToProps() {
    return {};
}

const mapDispatchToProps = {
};

class ErrorBoundary extends Component {
    static propTypes = {};
    static defaultProps = {};

    state = {
        componentStack: '',
        message: '',
    }

    constructor(props) {
        super(props);
        this.state = {hasError: false};
    }

    static getDerivedStateFromError() {
        return {hasError: true};
    }

    componentDidCatch(error, errorInfo) {
        this.setState({componentStack: errorInfo.componentStack, message: error.message});
    }

    render() {
        const {hasError, componentStack, message} = this.state;
        if (hasError) {
            return (
                <>
                    <h1>Sorry! something went wrong!</h1>
                    <Alert alert={{color: 'danger'}}>{message}</Alert>
                    <code className="pre">
                        <pre style={{whiteSpace: 'pre-wrap'}}>
                            {componentStack}
                        </pre>
                    </code>
                </>
            )
        }
        return this.props.children;
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ErrorBoundary);
