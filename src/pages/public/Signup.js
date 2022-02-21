
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faEnvelope, faUnlockAlt, faUser, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { faFacebookF, faGithub, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { Col, Row, Form, Card, Button, FormCheck, Container, InputGroup } from '@themesberg/react-bootstrap';
import { Link } from 'react-router-dom';
import { Store } from 'react-notifications-component';

import { Routes } from "../../routes";
import BgImage from "../../assets/img/illustrations/signin.svg";

export default class Signup extends React.Component {
  state = {
    client: null,
    loading: false
  }
  componentDidMount() {
    const { client, setLoaded } = this.props;
    this.setState({ client });
    setLoaded(true);
  }
  async onSubmit(e) {
    e.preventDefault();
    this.setState({ loading: true });
    const { client } = this.state;
    const form = e.target;
    const formData = new FormData(form);
    if (formData.get('password') !== formData.get('rePassword')) {
      this.setState({ loading: false });
      return this.props.notify({
        title: 'Validation error',
        message: 'Password mismatch!',
        type: 'warning',
        container: 'center'
      });
    }
    const data = {};
    formData.forEach((value, key) => data[key] = value);
    try {
      const user = await client.service('users').create(data);
      this.setState({ loading: false });
      this.props.history.replace('/');
      return this.props.notify({
        title: 'Registration Successful',
        message: 'Proceed to login to continue',
        type: 'success',
        container: 'center'
      });
    } catch (e) {
      this.setState({ loading: false });
      return this.props.notify({
        title: 'Validation error',
        message: e.errors.map((er) => er.message).join('\n'),
        type: 'warning',
        container: 'center'
      });
    }
  }
  render() {
    const { loading } = this.state;
    return (
      <main>
        <section className="d-flex align-items-center my-5 mt-lg-6 mb-lg-5">
          <Container>
            <p className="text-center">
              <Card.Link as={Link} to={Routes.Signin.path} className="text-gray-700">
                <FontAwesomeIcon icon={faAngleLeft} className="me-2" /> Back to homepage
              </Card.Link>
            </p>
            <Row className="justify-content-center form-bg-image" style={{ backgroundImage: `url(${BgImage})` }}>
              <Col xs={12} className="d-flex align-items-center justify-content-center">
                <div className="mb-4 mb-lg-0 bg-white shadow-soft border rounded border-light p-4 p-lg-5 w-100 fmxw-500">
                  <div className="text-center text-md-center mb-4 mt-md-0">
                    <h3 className="mb-0">Create an account</h3>
                  </div>
                  <Form className="mt-4" onSubmit={this.onSubmit.bind(this)}>
                    <Form.Group id="name" className="mb-4">
                      <Form.Label>Your Name</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>
                          <FontAwesomeIcon icon={faUser} />
                        </InputGroup.Text>
                        <Form.Control autoFocus required name="name" type="text" placeholder="John Doe" />
                      </InputGroup>
                    </Form.Group>
                    <Form.Group id="email" className="mb-4">
                      <Form.Label>Your Email</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>
                          <FontAwesomeIcon icon={faEnvelope} />
                        </InputGroup.Text>
                        <Form.Control autoFocus required name="email" type="email" placeholder="example@company.com" />
                      </InputGroup>
                    </Form.Group>
                    <Form.Group id="password" className="mb-4">
                      <Form.Label>Your Password</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>
                          <FontAwesomeIcon icon={faUnlockAlt} />
                        </InputGroup.Text>
                        <Form.Control required name="password" type="password" placeholder="Password" />
                      </InputGroup>
                    </Form.Group>
                    <Form.Group id="confirmPassword" className="mb-4">
                      <Form.Label>Confirm Password</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>
                          <FontAwesomeIcon icon={faUnlockAlt} />
                        </InputGroup.Text>
                        <Form.Control required name="rePassword" type="password" placeholder="Confirm Password" />
                      </InputGroup>
                    </Form.Group>
                    <FormCheck type="checkbox" className="d-flex mb-4">
                      <FormCheck.Input required id="terms" className="me-2" />
                      <FormCheck.Label htmlFor="terms">
                        I agree to the <Card.Link>terms and conditions</Card.Link>
                      </FormCheck.Label>
                    </FormCheck>

                    <Button variant="primary" type="submit" className="w-100">
                      {!loading ? "Sign up" : <FontAwesomeIcon icon={faSpinner} className="spinner" />}
                    </Button>
                  </Form>

                  {/* <div className="mt-3 mb-4 text-center">
                    <span className="fw-normal">or</span>
                  </div>
                  <div className="d-flex justify-content-center my-4">
                    <Button variant="outline-light" className="btn-icon-only btn-pill text-facebook me-2">
                      <FontAwesomeIcon icon={faFacebookF} />
                    </Button>
                    <Button variant="outline-light" className="btn-icon-only btn-pill text-twitter me-2">
                      <FontAwesomeIcon icon={faTwitter} />
                    </Button>
                    <Button variant="outline-light" className="btn-icon-only btn-pil text-dark">
                      <FontAwesomeIcon icon={faGithub} />
                    </Button>
                  </div> */}
                  <div className="d-flex justify-content-center align-items-center mt-4">
                    <span className="fw-normal">
                      Already have an account?
                      <Card.Link as={Link} to={Routes.Signin.path} className="fw-bold">
                        {` Login here `}
                      </Card.Link>
                    </span>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </section>
      </main>
    );
  }
};
