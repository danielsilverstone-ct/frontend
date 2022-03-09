import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js'
import Router from 'next/router';
import { FunctionComponent, useEffect, useRef, useState } from 'react'
import { TRANSACTION_SAVE_CARD_URL } from '../../../env';
import Button from '../../Button';
import Spinner from '../../Spinner';

interface Props {
  transaction: string
}

const PaymentForm: FunctionComponent<Props> = ({transaction}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [errmsg, setErrmsg] = useState(null);
  const saveCardRef = useRef<HTMLInputElement>();
  const [processing, setProcessing] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Load hasn't completed yet
      return;
    }

    setProcessing(true)

    const save_card = saveCardRef.current.checked
    const body = JSON.stringify({
        save_card: save_card ? "on_session" : null,
      })

    await fetch(TRANSACTION_SAVE_CARD_URL(transaction), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: 'include',
      body
    })

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Realistically we should redirect somewhere else so that we get rid
        // of the form etc.  But everything is in the wallet for now.
        return_url: window.location.href,
      }
    });

    if (result.error) {
      setErrmsg(result.error.message)
      setProcessing(false)
    } else {
      // Redirect will have occurred
    }
  }

  return (<form onSubmit={handleSubmit}>
    {errmsg ? (<b>{errmsg}</b>) : (<></>)}
    <PaymentElement />
    <label htmlFor='save-card'><input id='save-card' type={"checkbox"} ref={saveCardRef} />Save Card for reuse</label><br />
    <Button disabled={processing || !stripe}>{processing ? <Spinner size={25} text={""} /> : "Submit payment"}</Button>
  </form>)
}

export default PaymentForm
