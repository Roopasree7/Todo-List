await prisma.task.create({
  data: {
    title: 'Fix Prisma',
    user: {
      connect: { id: 'SOME_EXISTING_USER_ID' }
    }
  }
});
