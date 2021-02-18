import { useEffect, useReducer, useState } from "react";
import { connect } from "react-redux";
import { getExchangeData } from "../state/actions";
import { IExpenseReceipt } from "../types/index";
import './expense-form.css';
import { MAX_RECEIPTS, MAX_AMOUNT } from "../utils/constants";
function ExpenseForm(props) {


    const [isDisabled, setIsDisabled] = useState(false);
    const [currency, setCurrency] = useState('CAD');
    const [amount, setAmount] = useState(994);
    const [description, setDesc] = useState('Hotel expense');
    const [errMsg, setErrMsg] = useState('');

    //component is mounted
    useEffect(function () {
        props?.getExchangeData();
    }, []); //props.postObject.title-this will ensure that this prop is watched for changes

    const [receiptsData, dispatch] = useReducer((receiptsData, { type, value }) => {
        setErrMsg('');
        if (receiptsData.length >= MAX_RECEIPTS) {
            setErrMsg('You exceeded limit of ' + MAX_RECEIPTS);
            return receiptsData;
        }
        switch (type) {
            case "add":
                return [...receiptsData, value];
            case "remove":
                return receiptsData.filter((_, index) => index !== value);
            default:
                return receiptsData;
        }
    }, []);

    const getCadAmount = (cur, value) => {
        const rateList = props.items?.rates;

        if (cur === 'CAD') {
            return value;
        }
        else if (cur === 'EUR') {
            //get converted value
            return rateList['CAD'] * value;
        }
        else {
            let rate: any = Object.entries(rateList).find(item => {
                const itemCur = item[0];
                const itemValue = item[1];
                return itemCur === cur && itemValue;
            });
            if (rate && rate[1]) {
                let curValueInEur = 1 / (parseFloat(rate[1]));
                curValueInEur = curValueInEur * value;
                const curValueSelected = curValueInEur * rateList['CAD'];
                return curValueSelected.toPrecision(2);
            }
            return value;
        }
    }

    const setButtonStatus = (curAmount) => {
        setErrMsg('');
        const maxCadExpenseAmount:number = MAX_AMOUNT;
        let totalAmount: number = receiptsData.reduce((total: number, item) => +total + +item.amount, 0);
        if (isNaN(curAmount) || !curAmount) {
            setIsDisabled(totalAmount > maxCadExpenseAmount);
            return;
        }
        debugger;
        const curCadAmount:number = getCadAmount(currency, curAmount);
        console.log(totalAmount + curCadAmount);
        totalAmount = +totalAmount + +curCadAmount;
        if ( totalAmount > maxCadExpenseAmount) {
            setErrMsg("Your amount exceeded " + maxCadExpenseAmount)
        }
        setIsDisabled(totalAmount  > maxCadExpenseAmount);
    }

    const addExpense = (e) => {
        console.log(currency, description, amount);
        if (!isNaN(amount) && amount > 0) {
            dispatch({ type: "add", value: { amount: getCadAmount(currency, amount), currency: currency, description: description } as IExpenseReceipt });
        }
        setAmount(0);//reset
        console.log(receiptsData);
    }

    const submitExpenses = () =>{
        console.log(receiptsData);
        receiptsData.splice(0, receiptsData.length)
    }

    let currList = props.items?.rates
        && Object.keys(props.items?.rates).map((item, i) => {
            return (
                <option key={i} value={item} >{item}</option>
            )
        });

    const currencySelected = (e) => {
        setCurrency(e && e.target.value);
    }

    useEffect(() => {
        debugger;
        setButtonStatus(amount);
     }, [currency]);

    return (
        <div className="mt-3 w-25">
            <div >
                <h3>Add expenses.</h3>
                <div className="mt-5">
                    <label >Currency</label>
                    <select defaultValue={'CAD'} onChange={e => currencySelected(e)}>
                        {props.items?.rates && currList}
                        {props.items?.rates && <option key={props.items?.base} value={props.items?.base} >{props.items?.base}</option>}

                    </select>
                    {/* <input required type="text" className="form-control" id="currency" value={currency} onChange={e => setCurrency(e.target['value'])} /> */}
                </div>
                <div className="">
                    <label >Amount:</label>
                    <input required type="number" min="1" max="1000" className="form-control required" id="amount" value={amount} onChange={e => { setAmount(parseInt(e.target['value'])); setButtonStatus(parseInt(e.target['value'])); }} />
                    <label >{currency !== 'CAD' ? '(In CAD: ' + getCadAmount(currency, amount) + ')' : ''}</label>

                </div>
                <div className="">
                    <label >Description:</label>
                    <input required type="textarea" className="form-control required" id="description" value={description} onInput={e => setDesc(e.target['value'])} />
                </div>
                <div>

                    <button type="button" disabled={isDisabled || !amount || !description} onClick={addExpense} className="btn btn-success mt-2">Add</button>
                </div>
            </div>
            <div>
                <label className="text-danger">{errMsg}</label>
            </div>
            <div className="mt-3">
                <table>
                    <thead>
                        <tr>
                            <th>Currency</th>
                            <th>Amount(CAD)</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {receiptsData.map((item, index) => (
                            <tr key={index}>
                                <td>{item.currency}</td>
                                <td>{item.amount}</td>
                                <td>{item.description}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div>
                <label className="text-info">{'Total(CAD):'}{receiptsData.reduce((total, item) => total + parseFloat(item.amount), 0)}</label>
            </div>
            <div>

                <button type="button" disabled={receiptsData.reduce((total, item) => total + parseFloat(item.amount), 0) <=0} onClick={submitExpenses} className="btn btn-info mt-2">Submit</button>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        items: state.items,
        hasError: state.itemsHaveError,
        isLoading: state.itemsAreLoading
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getExchangeData: () => dispatch(getExchangeData())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ExpenseForm);
