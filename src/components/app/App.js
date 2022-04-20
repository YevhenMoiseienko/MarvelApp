import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import {MainPage, ComicsPage, Pages404} from '../pages'

import AppHeader from "../appHeader/AppHeader";
import SingleComicPage from "../pages/SingleComicPage";

const App = () => {
    return (
        <Router>
            <div className="app">
                <AppHeader/>
                <main>
                    <Switch>
                        <Route exact path="/">
                            <MainPage/>
                        </Route>
                        <Route exact path="/comics">
                            <ComicsPage/>
                        </Route>
                        <Route exact path="/comics/:comicId">
                            <SingleComicPage/>
                        </Route>
                        <Route exact path="*">
                            <Pages404/>
                        </Route>
                    </Switch>
                </main>
            </div>
        </Router>
    )
}

export default App;