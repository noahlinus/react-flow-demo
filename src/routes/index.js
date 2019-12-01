import React from 'react'

import { Switch, Route } from 'react-router-dom'
import Flow from '@/modules/Flow'

const Routers = () => (
  <Switch>
    <Route exact path="/" component={Flow} />
  </Switch>
)

export default Routers
