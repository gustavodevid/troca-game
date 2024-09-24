import mongoose from 'mongoose';

const retiradaSchema = new mongoose.Schema({
  id: {
    type: String,
    default: () => new mongoose.Types.ObjectId(), 
  },
  nomeCliente: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  cpfCliente: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  localizacaoLoja: {
    type: {
      type: String, 
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  item: {
    type: String,
    required: true,
  },
  concluida: {
    type: Boolean,
    default: false, 
  },
});

retiradaSchema.index({ localizacaoLoja: '2dsphere' });

const Retirada = mongoose.model('Retirada', retiradaSchema);
export default Retirada;
