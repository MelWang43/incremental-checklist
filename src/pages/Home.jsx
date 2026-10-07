import '../css/Home.css'
import ProjectDisplayPage from './ProjectDisplayPage'

function Home(){

    
    return (
        <div className="grid-page">
            <aside className="home-sidebar">Test</aside>
            <main className="home-main"><ProjectDisplayPage/></main>
        </div>
    )
}

export default Home