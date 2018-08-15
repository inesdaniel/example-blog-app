/* global Vue, VueRouter, axios */
var PostsEditPage = {
  template: "#posts-edit-page",
  data: function() {
    return {
      title: "",
      body: "",
      user_id: "",
      errors: []
    };
  },
  methods: {
    submit: function() {
      console.log("in the edit post submit function");
      var params = {
        title: this.title,
        body: this.body,
        user_id: this.user_id
      };
      axios
        .post("/v1/posts", params)
        .then(function(response) {
          router.push("/");
        })
        .catch(
          function(error) {
            this.errors = error.response.data.errors;
          }.bind(this)
        );
    }
  }
};

var PostsShowPage = {
  template: "#posts-show-page",
  data: function() {
    return {
      message: "Posts!",
      post: {title: "", body: "", user_id: ""}
    };
  },
  created: function() {
    axios.get('/v1/posts/' + this.$route.params.id).then(function(response) {
      console.log(response);
      this.post = response.data;
    }.bind(this));
  },
  methods: {},
  computed: {}
};

var PostsNewPage = {
  template: "#posts-new-page",
  data: function() {
    return {
      title: "",
      body: "",
      user_id: "",
      errors: []
    };
  },
  methods: {
    submit: function() {
      console.log("in the new post submit function");
      var params = {
        title: this.title,
        body: this.body,
        user_id: this.user_id
      };
      axios
        .post("/v1/posts", params)
        .then(function(response) {
          router.push("/");
        })
        .catch(
          function(error) {
            this.errors = error.response.data.errors;
          }.bind(this)
        );
    }
  }
};

var HomePage = {
  template: "#home-page",
  data: function() {
    return {
      message: "Posts!",
      posts: [],
      selectedPost: {title: "", user_id: "", body: ""}
    };
  },
  created: function() {
    axios.get('/v1/posts').then(function(response) {
      console.log(response);
      this.posts = response.data;
    }.bind(this));
  },
  methods: {
    viewThePost: function(inputPost) {
      this.selectedPost = inputPost;
    }
  },
  computed: {}
};

var SignupPage = {
  template: "#signup-page",
  data: function() {
    return {
      name: "",
      email: "",
      password: "",
      passwordConfirmation: "",
      errors: []
    };
  },
  methods: {
    submit: function() {
      console.log("in the signup submit function");
      var params = {
        name: this.name,
        email: this.email,
        password: this.password,
        password_confirmation: this.passwordConfirmation
      };
      axios
        .post("/v1/users", params)
        .then(function(response) {
          router.push("/login");
        })
        .catch(
          function(error) {
            this.errors = error.response.data.errors;
          }.bind(this)
        );
    }
  }
};

var LoginPage = {
  template: "#login-page",
  data: function() {
    return {
      email: "",
      password: "",
      errors: []
    };
  },
  methods: {
    submit: function() {
      var params = {
        auth: {email: this.email, password: this.password}
      };
      axios
        .post("user_token", params)
        .then(function(response) {
          axios.defaults.headers.common["Authorization"] =
            "Bearer " + response.data.jwt;
          localStorage.setItem("jwt", response.data.jwt);
          router.push("/"); 
        })
        .catch(
          function(error) {
            this.errors = ["Invalid email or password."];
            this.email = "";
            this.password = "";
          }.bind(this)
        );
    }
  }
};

var LogoutPage = {
  template: "<h1>Logout</h1>",
  created: function() {
    axios.defaults.headers.common["Authorization"] = undefined;
    localStorage.removeItem("jwt");
    router.push("/");
  }
};

var router = new VueRouter({
  routes: [
    { path: "/", component: HomePage },
    { path: "/signup", component: SignupPage },
    { path: "/login", component: LoginPage },
    { path: "/logout", component: LogoutPage },
    { path: "/posts/new", component: PostsNewPage },
    { path: "/posts/:id", component: PostsShowPage },
    { path: "/posts/:id/edit", component: PostsEditPage }
  ],
  scrollBehavior: function(to, from, savedPosition) {
    return { x: 0, y: 0 };
  }
});

var app = new Vue({
  el: "#vue-app",
  router: router,
  created: function() {
    var jwt = localStorage.getItem("jwt");
    console.log("jwt");
    console.log(jwt);
    if (jwt) {
      axios.defaults.headers.common["Authorization"] = jwt;
    }
  }
});