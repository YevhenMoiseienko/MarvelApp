import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import {Main, Comics} from '../pages'

import AppHeader from "../appHeader/AppHeader";

const App = () => {
    return (
        <Router>
            <div className="app">
                <AppHeader/>
                <main>
                    <Switch>
                        <Route exact path="/">
                            <Main/>
                        </Route>
                        <Route exact path="/comics">
                            <Comics/>
                        </Route>
                    </Switch>
                </main>
            </div>
        </Router>
    )
}

export default App;