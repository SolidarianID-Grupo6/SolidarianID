@EventPattern(CommunityEvent.NewCommunityUser)
  async handleEvent(dto: CommunityUserAddedDto) {
    this.usersService.addUserToCommunity(dto.userId, dto.communityId);
  }