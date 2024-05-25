import React from 'react'
import '../styles/home.css'
import { container, Row, Col, Container } from 'reactstrap';
import Subtitle from '../shared/Subtitle';
import SearchBar from '../shared/SearchBar';

const Home = () => {
  return (
    <>
      <section className='max-w-screen-xl mx-auto p-content__padding'>
        <Container>
          <Row>
            <Col lg='6'>
            {/* <div className="text-4xl font-bold text-blue-500">
                Hello
              </div> */}
            </Col>
          </Row>
        </Container>
      </section>

      <section>
        <Container>
          <Row>
            <Col lg='12' className='mb-5'>


            </Col>
          </Row>
        </Container>
      </section>

      <section>
        <Container>
          <Row>
            <Col lg='6'>
              
            </Col>
          </Row>
        </Container>
      </section>

      <section>
        <Container>
          <Row>

          </Row>
        </Container>
      </section>

      <section>
        <Container>
          <Row>

          </Row>
        </Container>
      </section>
    </>
  )
}

export default Home