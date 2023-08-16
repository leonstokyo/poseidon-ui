import request from '../utils/request';

const DELETE_IMAGE = '/ossUpload/deleteImage';

export default {
  deleteImage(name) {
    return request.post(DELETE_IMAGE, { name });
  },
};
