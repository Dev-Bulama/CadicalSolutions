        import prisma  from '@/lib/prisma';

        export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
          const body = await req.json();
          const { id } = await context.params;
          const product = await prisma.product.update({
            where: { id },
            data: body,
          });
          return Response.json(product);
        }

        export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
          const { id } = await context.params;
          await prisma.product.delete({ where: { id } });
          return Response.json({ success: true });
        }