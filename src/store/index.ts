import Vue from 'vue';
import Vuex from 'vuex';
import VuexORM from '@vuex-orm/core';
import Box from "@/store/models/box";
import Thread from "@/store/models/thread";


const database = new VuexORM.Database();
database.register(Box)
database.register(Thread)

Vue.use(Vuex);

const store = new Vuex.Store({
  plugins: [VuexORM.install(database)],

  modules: {
  },
});

export default store;
