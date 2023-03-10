import React from 'react'
import { Link } from 'react-router-dom'
import './styles.scss'

type Props = {}

const MenuApp = (props: Props) => {

  const openLink = () =>{
    window.open("https://testnets.opensea.io/collection/collector-chain-beta")
  }

  return (
    <div className='menuApp'>
        <Link className="menuApp__item" to="/">HOME</Link>
        <Link  className="menuApp__item" to="/howitworks">HOW IT WORKS</Link>
        <Link className="menuApp__item" to="/create">CREATE YOUR OBJECT (...SOON)</Link>
        <div className="menuApp__item" onClick={openLink}>COLLECTION</div>
    </div>
  )
}

export default MenuApp