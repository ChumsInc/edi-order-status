import {type ChangeEvent, useId} from 'react';
import Col from "react-bootstrap/Col";
import FormCheck from "react-bootstrap/FormCheck";
import FormControl from "react-bootstrap/FormControl";
import FormLabel from "react-bootstrap/FormLabel";
import {useAppSelector} from "@/app/configureStore.ts";
import {selectCurrentCustomer} from "@/ducks/customers/customersSlice.ts";
import {orderFormElements} from "@/ducks/orders/utils.ts";
import {useEdiOrdersForm} from "@/hooks/edi-orders-form/useEdiOrdersForm.ts";

const CompletedCheckBox = () => {
    const {completed, setCompleted, minDate, setMinDate, maxDate, setMaxDate} = useEdiOrdersForm();
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
                           name={orderFormElements.completed} value="1"
                           checked={completed} onChange={changeHandler}
                           label="Completed Orders"/>
            </Col>
            {completed && (
                <>
                    <Col xs="auto">
                        <FormLabel htmlFor={fromId} column={false}>From</FormLabel>
                        <FormControl type="date" id={fromId} size="sm" name={orderFormElements.minDate}
                                     value={minDate} onChange={onChangeMinDate} required/>
                    </Col>
                    <Col xs="auto">
                        <FormLabel htmlFor={toId} column={false}>To</FormLabel>
                        <FormControl type="date" id={toId} size="sm"  name={orderFormElements.maxDate}
                                     onChange={onChangeMaxDate} value={maxDate} required />
                    </Col>
                </>
            )}
        </>
    )
}

export default CompletedCheckBox;
