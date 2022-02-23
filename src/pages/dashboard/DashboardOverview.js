
import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Button, Modal, Form, Table, Card } from '@themesberg/react-bootstrap';


export default class DashboardOverview extends React.Component {
  state = {
    showDefault: false,
    client: null,
    messages: null
  }
  componentDidMount() {
    const { client } = this.props;
    console.log(this.props);
    this.setState({ client }, () => this.fetchMessages());
  }
  handleClose = () => this.setState({ showDefault: !this.state.showDefault });
  async sendMessage(e) {
    e.preventDefault();
    const { client } = this.state;
    const form = e.target;
    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => data[key] = value);
    try {
      const message = await client.service('messages').create(data);
      this.setState({ showDefault: false }, () => this.fetchMessages());
    } catch (e) {
      console.log(e);
      this.setState({ loading: false });
      if (typeof e.errors == 'object') {
        return this.props.notify({
          title: 'Error',
          message: e.errors.map((er) => er.message).join('\n'),
          type: 'warning',
          container: 'top-right'
        });
      } else if (e.message) {
        return this.props.notify({
          title: 'Error',
          message: e.message,
          type: 'warning',
          container: 'top-right'
        });
      } else {
        return this.props.notify({
          title: 'Error',
          message: e,
          type: 'warning',
          container: 'top-right'
        });
      }
    }
  }
  async fetchMessages() {
    const { user } = this.props;
    const { client } = this.state;
    const messages = await client.service('messages').find({
      query: {
        userId: user.id
      }
    });
    this.setState({ messages });
  }
  render() {
    const { showDefault, messages } = this.state;
    return (
      <>
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
          <Button variant="primary" size="sm" className="me-2" onClick={() => this.setState({ showDefault: true })}>
            <FontAwesomeIcon icon={faPlus} className="me-2" />Compose Message
          </Button>
        </div>
        <Row className="justify-content-md-center">
          <Col xs={12} className="mb-4 d-none d-sm-block">
            <Card>
              <Table>
                <thead className="thead-light">
                  <tr>
                    <th className="border-0">ID</th>
                    <th className="border-0">Phone Number</th>
                    <th className="border-0">Message</th>
                    <th className="border-0">Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {messages ?
                    messages.data.map((d, i) => (
                      <tr key={i}>
                        <td className="border-0">{d.id}</td>
                        <td className="border-0">{d.phone}</td>
                        <td className="border-0">{d.text}</td>
                        <td className="border-0">{d.createdAt}</td>
                      </tr>
                    ))
                    : (
                      <p>Loading...</p>
                    )}
                </tbody>
              </Table>
            </Card>
          </Col>
        </Row>

        <Modal as={Modal.Dialog} centered show={showDefault} onHide={this.handleClose.bind(this)}>
          <Modal.Header>
            <Modal.Title className="h6">Compose Message</Modal.Title>
            <Button variant="close" aria-label="Close" onClick={this.handleClose.bind(this)} />
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={this.sendMessage.bind(this)}>
              <Form.Group className="mb-3">
                <Form.Label>Nomor Telepon</Form.Label>
                <Form.Control name="phone" type="tel" placeholder="08XXXXXXXXXXX" />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Deskripsi</Form.Label>
                <Form.Control name="text" as="textarea" rows="3" />
              </Form.Group>
              <Button type="submit">Simpan</Button>
            </Form>
          </Modal.Body>
        </Modal>
      </>
    );
  }
};
