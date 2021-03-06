// import { Row } from 'antd'
import './index.less'

const Zombie = ({ zombieName }: { zombieName: any }) => {
  return (
    <div className="home-card game-card">
      <div className="zombie-char">
        <div className="zombie-loading zombie-parts"></div>
        <div className="zombie-card">
          <div className="card-header hide-overflow-text">{zombieName}</div>
        </div>
      </div>
    </div>
  )
}

export default Zombie
