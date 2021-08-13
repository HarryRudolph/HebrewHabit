/**
 * @file Renders brief alert message.
 * @author Harry Rudolph
 */
import Alert from "react-bootstrap/Alert";
import { useState, useEffect } from "react";

/**
 *
 * @param props.type Type of message: 'Success' or 'Danger'
 * @param props.text Text for message to display
 * @param {Function} props.handler Function to be called once message disappears.
 * @returns Alert if showing.
 */
const Message = (props) => {
  const [show, setShow] = useState(true);

  /**
   * React useEffect hook. This is called once when component is first mounted.
   */
  useEffect(() => {
    const timeId = setTimeout(() => {
      setShow(false);
    }, 3000);

    return () => {
      clearTimeout(timeId);
    };
  }, []); //The [] ensures that this use effect is only called on first update.

  if (show) {
    return (
      <Alert className="mx-3" variant={props.type}>
        {props.text}{" "}
      </Alert>
    );
  } else {
    //Once finished showing called the passed in handler.
    //In effect I am using this to unmount component from parent.
    props.handler();
    return null;
  }
};

export default Message;
