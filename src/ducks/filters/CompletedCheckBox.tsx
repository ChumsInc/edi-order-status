import React, {ChangeEvent, useId} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {
    selectMaxDateFilter,
    selectMinDateFilter,
    selectShowCompletedFilter,
    setMaxDate,
    setMinDate,
    toggleShowCompleted
} from "./index";
import Col from "react-bootstrap/Col";
import FormCheck from "react-bootstrap/FormCheck";
import FormControl from "react-bootstrap/FormControl";
import FormLabel from "react-bootstrap/FormLabel";

const CompletedCheckBox = () => {
    const dispatch = useDispatch();
    const showCompleted = useSelector(selectShowCompletedFilter);
    const minDate = useSelector(selectMinDateFilter);
    const maxDate = useSelector(selectMaxDateFilter);
    const id = useId();
    const fromId = useId();
    const toId = useId();

    const onToggleCompleted = (ev: ChangeEvent<HTMLInputElement>) => dispatch(toggleShowCompleted(ev.target.checked));
    const onChangeMinDate = (ev: React.ChangeEvent<HTMLInputElement>) => dispatch(setMinDate(ev.target.value))
    const onChangeMaxDate = (ev: React.ChangeEvent<HTMLInputElement>) => dispatch(setMaxDate(ev.target.value));

    return (
        <>
            <Col xs="auto">
                <FormCheck type="checkbox" id={id}
                           checked={showCompleted} onChange={onToggleCompleted}
                           label="Completed Orders"/>
            </Col>
            {showCompleted && (
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
