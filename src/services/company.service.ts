import { ICompany, CompanyModel } from "../models/company";
import { IReview, ReviewModel } from "../models/review";
import {  ProductModel } from "../models/product";
import { encrypt, verified} from "../utils/bcrypt.handle";
import { IOrder, OrderModel } from "../models/order";

export class CompanyService {
  async postCompany(company: Partial<ICompany>): Promise<ICompany> {
    try {

      const newCompany = new CompanyModel({
      ...company,
      rating: company.rating ?? 0,
      userRatingsTotal: company.userRatingsTotal ?? 0,
      products: company.products ?? [],
      reviews: company.reviews ?? [],
      wallet: company.wallet ?? 0,
      followers: company.followers ?? 0,
      photos: company.photos ?? [],
      icon: company.icon ?? "https://res.cloudinary.com/dqj8xgq4h/image/upload/v1697060982/CompanyIcon_1_ojzv5c.png"
    });
    if (!company.password) {
      throw new Error("Password is required");
    }
    newCompany.password = await encrypt(company.password); // Asegúrate de que company.password no sea undefined
      return newCompany.save();
    } catch (error: any) {
      if (error.code === 11000) {
        throw new Error("El email ya está registrado");
      }
      throw error;
    }
  }

  async getAllCompanies(): Promise<ICompany[]> {
    return CompanyModel.find().populate("products").exec();
  }

  async getCompanyById(id: string): Promise<ICompany | null> {
    return CompanyModel.findById(id);
  }

  async updateCompanyById(
    id: string,
    company: ICompany
  ): Promise<ICompany | null> {
    try {
      if (company.email) {
        // Buscar si ya existe un usuario con este email
        const existingCompany = await CompanyModel.findOne({
          email: company.email,
        });

        // Si se encuentra un usuario con el mismo email y su ID no coincide
        if (existingCompany && existingCompany._id.toString() !== id) {
          throw new Error("El email ya está registrado");
        }
      }
      return CompanyModel.findByIdAndUpdate(id, company, { new: true });
    } catch (error: any) {
      if (error.code === 11000) {
        throw new Error("El email ya está registrado");
      }
      throw error;
    }
  }

  async deleteCompanyById(id: string): Promise<ICompany | null> {
    return CompanyModel.findByIdAndDelete(id);
  }

  async getCompanyWithProductsById(id: string): Promise<ICompany | null> {
    return CompanyModel.findById(id).populate("products").exec();
  }

  async RateCompany(id: string, rating: number): Promise<ICompany | null> {
    const company = await CompanyModel.findById(id);
    if (!company) {
      throw new Error("Company not found");
    }
    const newRating =
      (company.rating * company.userRatingsTotal + rating) /
      (company.userRatingsTotal + 1);
    company.rating = newRating;
    company.userRatingsTotal += 1;
    return company.save();
  }

  async reviewCompany(review: Partial<IReview>): Promise<IReview | null> {
    if (!review.user_id || !review.company_id || review.rating === undefined) {
      throw new Error(
        "Faltan datos obligatorios para crear o actualizar la reseña"
      );
    }
    if (!review._id) {
        delete review._id;
    }

    const company = await CompanyModel.findById(review.company_id);
    if (!company) {
      throw new Error("Company not found");
    }

    // Comprueba si la empresa ya tiene una reseña del usuario
    const existingReview = await ReviewModel.findOne({
      user_id: review.user_id,
      company_id: review.company_id,
    });
    if (existingReview) {
      // Actualiza la reseña existente
      

      const updatedReview = await ReviewModel.findByIdAndUpdate(
        existingReview._id,
        review,
        { new: true }
      );
      if (!updatedReview) {
        throw new Error("Error al actualizar la reseña");
      }
      

      // Actualiza la calificación de la empresa
      const updatedRating = parseFloat(
        (
          (company.rating * company.userRatingsTotal -
            existingReview.rating +
            review.rating) /
          company.userRatingsTotal
        ).toFixed(2)
      );
      company.rating = updatedRating;

      // Actualiza el vector de reseñas de la empresa
      company.reviews = company.reviews?.map((r) =>
        r.toString() === existingReview._id.toString() ? updatedReview._id : r
      );

      await company.save();
      return updatedReview;
    } else {
      // Crea una nueva reseña
      
      const newReview = new ReviewModel(review);
      
      company.reviews?.push(newReview._id);
      company.rating = parseFloat(
        (
          (company.rating * company.userRatingsTotal + review.rating) /
          (company.userRatingsTotal + 1)
        ).toFixed(2)
      );
      company.userRatingsTotal += 1;

      await company.save();
      return newReview.save();
    }
  }

  async getCompanyReviews(companyId: string): Promise<IReview[]> {
    if (!companyId || companyId.length !== 24) {
      throw new Error("ID inválido");
    }
    await ReviewModel.find({ company_id: companyId })
      .populate("user_id")
      .exec();
    return ReviewModel.find({ company_id: companyId })
      .populate("user_id")
      .exec();
  }

  async addProductToCompany(
    companyId: string,
    productId: string
  ): Promise<ICompany | null> {
    try {
      // Verificar que la compañía existe
      const company = await CompanyModel.findById(companyId);
      if (!company) {
        throw new Error("Empresa no encontrada");
      }

      // Verificar que el producto existe
      const product = await ProductModel.findById(productId);
      if (!product) {
        throw new Error("Producto no encontrado");
      }

      // Verificar si el producto ya está en la compañía
      if (company.products.some((p) => p.toString() === productId)) {
        throw new Error("El producto ya está asociado a esta empresa");
      }

      // Añadir el producto a la compañía
      company.products.push(product._id);

      // Guardar y devolver la compañía actualizada
      return await company.save();
    } catch (error) {
      console.error("Error al añadir producto a la empresa:", error);
      throw error;
    }
  }



  async getCompanyByName(text: string): Promise<ICompany[]> {
    try {
      // Buscar compañías que coincidan con el texto
      const matchedCompanies = await CompanyModel.find({ $text: { $search: text } }).exec();
      return matchedCompanies as ICompany[];
    } catch (error) {
      console.error("Error al buscar compañías:", error);
      throw new Error("No se pudieron buscar las compañías");
    }
  }

  async getCompaniesByProductName(productName: string): Promise<ICompany[]> {
  try {
    // Buscar productos que coincidan con el nombre proporcionado
    const matchedProducts = await ProductModel.find({
      $text: { $search: productName },
    }).exec();

    // Extraer los IDs de las empresas asociadas a los productos encontrados
    const companyIds = matchedProducts.map((product) => product.companyId);

    // Eliminar duplicados de los IDs de las empresas
    const uniqueCompanyIds = [...new Set(companyIds)];

    // Buscar las empresas por sus IDs
    const companies = await CompanyModel.find({ _id: { $in: uniqueCompanyIds } }).exec();

    return companies;
  } catch (error) {
    console.error("Error al buscar empresas por nombre de producto:", error);
    throw new Error("No se pudieron buscar las empresas");
  }
}
  
    async loginCompany(email: string, password: string): Promise<{ company: ICompany }> {
        const company = await CompanyModel.findOne({ email });
        if (!company) {
          throw new Error("Email o contraseña incorrectos");
        }
    
        // Comparación directa de contraseñas
        await verified(password, company.password); 
        // if (!isPasswordValid) {
        //   throw new Error("Email o contraseña incorrectos");
        // }
    
        return {  company: company.toObject() as ICompany};
        //return { token, refreshToken };
      }
  
      async updateAvatar( avatar:string, email: string): Promise<ICompany | null>{
          return await CompanyModel.findOneAndUpdate({email:email}, { icon: avatar }, { new: true });
        }
  
  async addPendingOrderToCompany(
    companyId: string,
    orderId: string
  ): Promise<ICompany | null> {
    try {
      const company = await CompanyModel.findById(companyId);
      if (!company) {
        throw new Error("Company not found");
      }
      if (!company.pendingOrders) {
        company.pendingOrders = [];
      }
      const order = await OrderModel.findById(orderId);
      if (!order) {
        throw new Error("Order not found");
      }
      company.pendingOrders.push(order._id);
      return await company.save();
    } catch (error) {
      console.error("Error al añadir pedido pendiente a la empresa:", error);
      throw error;
    }
  }

  async getPendingOrdersByCompanyId(
    companyId: string
  ): Promise<IOrder[] | null> {
    try {
      const company = await CompanyModel.findById(companyId).populate("pendingOrders");
      if (!company) {
        throw new Error("Company not found");
      }
      // Ensure pendingOrders is populated with full Order documents
      return (company.pendingOrders ?? []) as unknown as IOrder[];
    } catch (error) {
      console.error("Error al obtener pedidos pendientes de la empresa:", error);
      throw error;
    }
  }


  async putCompanyPhoto(
    companyId: string,
    photo: string
  ): Promise<ICompany | null> {
    try {
      const company = await CompanyModel.findById(companyId);
      if (!company) {
        throw new Error("Company not found");
      }
      if (!company.photos) {
        company.photos = [];
      }
      company.photos.push(photo);
      return await company.save();
    } catch (error) {
      console.error("Error al añadir foto a la empresa:", error);
      throw error;
    }
  }

  async updateCompanyPhotos(
    companyId: string,
    photos: string[]
  ): Promise<ICompany | null> {
    try {
      const company = await CompanyModel.findById(companyId);
      if (!company) {
        throw new Error("Company not found");
      }
      company.photos = photos;
      return await company.save();
    } catch (error) {
      console.error("Error al actualizar fotos de la empresa:", error);
      throw error;
    }
  }
}






