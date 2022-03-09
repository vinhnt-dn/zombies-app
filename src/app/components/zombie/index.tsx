// import { Row } from 'antd'
import './index.less'

const Zombie = () => {
  return (
    <div className="home-card game-card">
      <div className="zombie-char">
        <div className="zombie-loading zombie-parts"></div>
        <div className="zombie-card">
          <div className="card-header hide-overflow-text">Zombie Name</div>
        </div>
      </div>
    </div>
  )
}

export default Zombie
