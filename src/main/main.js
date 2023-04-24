const mqtt = require('mqtt');

const { ErrorCallBack } = require('./utils/error-callback.js');

const host = 'broker.emqx.io';
const port = '1883';
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;

const connectUrl = `mqtt://${host}:${port}`;
console.log(connectUrl);
const client = mqtt.connect(connectUrl, {
  clientId,
  clean: true,
  connectTimeout: 4000,
  username: 'emqx',
  password: 'public',
  reconnectPeriod: 1000,
});

const topic = '/nodejs/mqtt/ligar';
const subTopic = '/nodejs/mqtt/desligar';

const subTopicLed = '/nodejs/mqtt/led';

let led = true;

client.on('connect', () => {
  console.log('Connected');
  // Acao ao enviar um publish ao topico
  client.subscribe(topic, () => {
    console.log(`Subscribe to topic '${topic}'`);
  });
  // Utilizado para enviar uma mensagem quando se conectar ao topic
  // client.publish(topic, 'Voce se conectou ao topico de ligar', { qos: 0, retain: false }, ErrorCallBack);

  // Acao ao enviar um publish ao topico
  client.subscribe(subTopic, () => {
    console.log(`Subscribe to topic '${subTopic}'`);
  });
  // Utilizado para enviar uma mensagem quando se conectar ao topic
  // client.publish(subTopic, 'Voce se conectou ao topico de desligar', { qos: 0, retain: false }, ErrorCallBack);

  // Acao ao enviar um publish ao topico
  client.subscribe(subTopicLed, () => {
    console.log(`Subscribe to topic '${subTopicLed}'`);
  });
  // Utilizado para enviar uma mensagem quando se conectar ao topic
  // client.publish(subTopicLed, `O led esta ${led}`, { qos: 0, retain: false }, ErrorCallBack);
});

client.on('message', (_topic, payloadBuffer) => {
  //console.log('Received Message:', topic, payload.toString() + topic);

  try {
    if (_topic === subTopicLed) return;
    if (_topic === subTopic) led = false;
    else if (_topic === topic) led = true;

    // const payload = payloadBuffer.toString();
    // const payloadParse = JSON.parse(payload);

    // led = payloadParse.led;

    client.publish(subTopicLed, `O led esta ${led}`, { qos: 0, retain: false }, ErrorCallBack);
  } catch (error) {
    console.log(error);
  }
});
