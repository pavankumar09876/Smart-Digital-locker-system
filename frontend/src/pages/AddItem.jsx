import { useState } from "react";

function AddItem() {
  const [receiver, setReceiver] = useState("");

  const submit = () => {
    alert(`Item added for receiver: ${receiver}`);
  };

  return (
    <>
      <h2>Add Item to Locker</h2>
      <input
        placeholder="Receiver phone or email"
        value={receiver}
        onChange={(e) => setReceiver(e.target.value)}
      />
      <br />
      <button onClick={submit}>Add Item</button>
    </>
  );
}

export default AddItem;
