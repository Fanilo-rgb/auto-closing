import React, {useEffect, useState} from 'react'
import {useNewBvStore} from "../../../store/orderStore.ts";
import type {person} from "../../../types/type.ts";
import {formatNumberCard} from "../../../utils/formatter.ts";

const PersonInput = () => {
  const { newBv, setNewBv } = useNewBvStore()
  const [info, setInfo] = useState<person>(newBv ? newBv.holder : { numberCard: "", name: "" });

  useEffect(() => {
    if (newBv === null) setInfo({ numberCard: "", name: "" })
  }, [newBv]);

  const handleNumberCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInfo({
      ...info,
      numberCard: formatNumberCard(value),
    })
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInfo({
      ...info,
      name: e.target.value,
    });
  };

  const handleBlur = () => {
    setNewBv({
      ...newBv,
      holder: info ? info : { name: "", numberCard: "" } ,
      fileId: newBv ? newBv.fileId : "",
      products: newBv ? newBv.products : []
    })
  }

  return (
    <>
      <input
        type="text"
        placeholder="Numero Carte"
        onChange={handleNumberCardChange}
        onBlur={handleBlur}
        value={formatNumberCard(info.numberCard)}
        className="border rounded-lg p-2"
      />
      <input
        type="text"
        placeholder="Nom Complet"
        onChange={handleNameChange}
        onBlur={handleBlur}
        value={info.name}
        className="border rounded-lg p-2"
      />
    </>
  )
}

export default PersonInput
