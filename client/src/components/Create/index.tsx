import React from 'react'
import { useContractWrite, usePrepareContractWrite } from 'wagmi'
import "./styles.scss"
import contractAddress from "../../contracts/CollectorChain/CollectorChain-address.json"
import contractABI from "../../contracts/CollectorChain/CollectorChain.json"

type Props = {}

const Create = (props: Props) => {
  const contractAddr :any = contractAddress.CollectorChain 
  const ABI = contractABI.abi

  const {config} = usePrepareContractWrite({
    address: contractAddr,
    abi : ABI,
    functionName : '__nftIdCounter'
  })
  const {write} = useContractWrite(config)

  return (
    <div className='create'>
        <div className="create__title">
            SUBMIT YOUR OBJECT (...SOON)
        </div>
        <div className="create__text">
        Please provide the requested informations
        </div>
        <div className="blueBackground">
            <div className="create__title--center">Picture of the object</div>
            <button className='create__button'>Select a file</button>
            <div className="create__title--center">Proof of ownership</div>
            <button className='create__button'>Select a file</button>
            <div className="create__title--center">Storage</div>
            <button className='create__button'>Select a storage</button>
            <div className="create__title--center">Number of Fractions</div>
            <button className='create__button'>Select a value</button>
            <button className='create__button create__button--big' onClick={()=> write?.()}>SUBMIT</button>
        </div>
    </div>
  )
}

export default Create