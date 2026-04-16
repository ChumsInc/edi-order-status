import {type ChangeEvent, useId} from 'react';
import Col from "react-bootstrap/Col";
import FormCheck from "react-bootstrap/FormCheck";
import FormControl from "react-bootstrap/FormControl";
import FormLabel from "react-bootstrap/FormLabel";
import {useEDIOrders} from "@/hooks/edi-orders/useEDIOrders.ts";
import {useAppSelector} from "@/app/configureStore.ts";
import {selectCurrentCustomer} from "@/ducks/customers/customersSlice.ts";

const CompletedCheckBox = () => {
    const {completed, setCompleted, minDate, setMinDate, maxDate, setMaxDate} = useEDIOrders();
    const currentCustomer = useAppSelector(selectCurrentCustomer);
    const id = useId();
    const fromId = useId();
    const toId = useId();

    const onChangeMinDate = (ev: ChangeEvent<HTMLInputElement>) => {
        setMinDate(ev.target.value);
    }

    const onChangeMaxDate = (ev: ChangeEvent<HTMLInputElement>) => {
        setMaxDate(ev.target.value);
    }

    const changeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
        setCompleted(ev.target.checked);
    }
    return (
        <>
            <Col xs="auto">
                <FormCheck type="checkbox" id={id} disabled={!currentCustomer}
                           checked={completed} onChange={changeHandler}
                           label="Completed Orders"/>
            </Col>
            {completed && (
                <>
                    <Col xs="auto">
                        <FormLabel htmlFor={fromId} column={false}>From</FormLabel>
                        <FormControl type="date" id={fromId} size="sm"
                                     value={minDate} onChange={onChangeMinDate} required/>
                    </Col>
                    <Col xs="auto">
                        <FormLabel htmlFor={toId} column={false}>To</FormLabel>
                        <FormControl type="date" value={maxDate} onChange={onChangeMaxDate} required
                                     id={toId} size="sm"/>
                    </Col>
                </>
            )}
        </>
    )
}

export default CompletedCheckBox;
