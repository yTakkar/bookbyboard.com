import React, { PropsWithChildren } from 'react'
import Container from './Container'

interface IPageContainerProps extends PropsWithChildren {}

const PageContainer: React.FC<IPageContainerProps> = props => {
  return <Container className="min-h-[85vh]">{props.children}</Container>
}

export default PageContainer
