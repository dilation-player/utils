import Node from './node';

export default {
  /**
   * Check if value is undefined then return or
   * @param value
   * @param or
   * @return mixed
   */
  or(value: any, or: any) {
    return value === undefined ? or : value;
  },

  pad: function (n: any, width: any, z: any = null) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  },

  parseTime: function (times: any) {
    if (times < 0) {
      times = 0;
    }

    let hours = Math.floor(times / 3600);
    let minutes = Math.floor((times - hours * 3600) / 60);
    let seconds = Math.floor(times - (minutes * 60 + hours * 3600));
    let format = (hours > 0 ? (this.pad(hours, 2) + ':') : '') + this.pad(minutes, 2) + ':' + this.pad(seconds, 2);

    return format;
  },

  node: function (element: any) {
    return new Node(element);
  },

  ready: function (call: any) {
    this.node(window).listen('load', call);
  }
};
