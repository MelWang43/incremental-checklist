import '../css/Home.css'
import ProjectPage from './ProjectPage'

function Home(){

    
    return (
        <div className="grid-page">
            <aside className="home-sidebar">Test</aside>
            <main className="home-main"><ProjectPage/></main>
        </div>
    )
}

export default Home