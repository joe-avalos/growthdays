import {useEffect, useState} from "react";
import {Button, Card, Col, Container, Form, Row, Spinner} from "react-bootstrap";

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'

function App() {
  const [form, setForm] = useState({})
  const [errors, setErrors] = useState({})
  const [validated, setValidated] = useState(false)
  const [cats, setCats] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect( () => {
    setLoading(true)
      fetch('http://localhost:8080/cat')
        .then(response => response.json())
        .then(data => {
          setCats(data)
          setLoading(false)
        })
        .catch(e => console.log(e))
  }, [])
  
  const setField = (field, value) => {
    setForm({
      ...form, [field]: value
    })
    if (!!errors[field]) setErrors({
      ...errors,
      [field]: null
    })
  }
  
  const formErrors = () => {
    const {age} = form
    const newErrors = {}
    if (Number.isNaN(parseInt(age))) {
      newErrors.age = 'Must be a valid number.'
    }
    return newErrors
  }
  
  const formSubmit = (event) => {
    const target = event.currentTarget
    event.preventDefault()
    event.stopPropagation()
    const newErrors = formErrors()
    if (target.checkValidity() === false || Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
    } else {
      const image = `https://placekitten.com/g/${Math.floor(Math.random() * (400 - 200 + 1) + 200)}/300`
      console.log(image)
      setForm({
        ...form, image
      })
      setLoading(true)
      fetch('http://localhost:8080/cat',{
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      })
        .then(response => response.json())
        .then(data => {
          setCats(data)
          setLoading(false)
        })
    }
    
    setValidated(true)
  }
  return (
    <div className="App">
      <Container>
        <Row className="justify-content-center">
          <Col xs={9}>
            <Form onSubmit={formSubmit} noValidate validated={validated}>
              <Form.Group className="mb-3" controlId="formCatName">
                <Row>
                  <Col xs={3}>
                    <Form.Label>Cat name:</Form.Label>
                  </Col>
                  <Col>
                    <Form.Control
                      type="text"
                      placeholder="Cat name"
                      required
                      onChange={(e) => setField('name', e.target.value)}/>
                    <Form.Control.Feedback
                      type="invalid">
                      Please provide a cat name.
                    </Form.Control.Feedback>
                  </Col>
                </Row>
              </Form.Group>
              <Form.Group className="mb-3" controlId="formCatAge">
                <Row>
                  <Col xs={3}>
                    <Form.Label>Cat age:</Form.Label>
                  </Col>
                  <Col>
                    <Form.Control
                      type="text"
                      placeholder="Cat age"
                      required
                      onChange={(e) => setField('age', e.target.value)}
                      isInvalid={!!errors.age}
                    />
                    <Form.Control.Feedback
                      type="invalid">
                      {!!errors.age ? errors.age : 'Please provide cat\'s age.'}
                    </Form.Control.Feedback>
                  </Col>
                </Row>
              </Form.Group>
              <Form.Group className="mb-3" controlId="formCatBreed">
                <Row>
                  <Col xs={3}>
                    <Form.Label>Cat breed:</Form.Label>
                  </Col>
                  <Col>
                    <Form.Control
                      type="text"
                      placeholder="Cat breed"
                      required
                      onChange={(e) => setField('breed', e.target.value)}/>
                    <Form.Control.Feedback
                      type="invalid">
                      Please provide a cat breed.
                    </Form.Control.Feedback>
                  </Col>
                </Row>
              </Form.Group>
              <Row>
                <Button variant="primary"
                        type="submit">
                  Submit
                </Button>
              </Row>
            </Form>
          </Col>
        </Row>
        <Row className="justify-content-start my-4">
        {loading || cats.length === 0 ?
          <Col xs={9}>
            <div className="m-auto spinner-container">
            <Spinner animation="grow" variant="primary" />
            </div>
          </Col> :
          <>
            {cats.map((cat,idx) =>
              <Col key={idx} xs={1} md={2} lg={3}>
                <Card className="cat-card">
                <Card.Img variant="top" src={cat.image} />
                <Card.Body>
                  <Card.Title>{cat.name}</Card.Title>
                  <Card.Text>
                    Age: {cat.age} years
                  </Card.Text>
                  <Card.Footer>
                    Breed: {cat.breed}
                  </Card.Footer>
                </Card.Body>
              </Card>
              </Col>)}
          </>
        }
        </Row>
      </Container>
    </div>);
}

export default App;
