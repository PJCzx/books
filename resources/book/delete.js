if(!me || this.creator !== me.id) {
    cancel("You must be both connected and creator", 401);
}