import UserModel from "../models/UserModel.js";
import BillingModel from "../models/Bilingmodal.js";
import ProductModel from "../models/Productmodal.js";
import EmployeeModel from "../models/Empolyeemodal.js";
import ClientModel from "../models/Clientmodal.js";

export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      0,
      0,
      0,
      0,
    );
    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      23,
      59,
      59,
      999,
    );

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0,
      23,
      59,
      59,
      999,
    );

    if (user.role === "admin") {
      // ── Daily Bills ──

      const dailyBills = await BillingModel.find({
        createdBy: userId,
        createdAt: { $gte: startOfDay, $lte: endOfDay },
      });
      const dailySales = dailyBills.reduce(
        (sum, b) => sum + (b.totalAmount || 0),
        0,
      );
      const dailyBillCount = dailyBills.length;

      // ── Monthly Bills ──

      const monthlyBills = await BillingModel.find({
        createdBy: userId,
        createdAt: { $gte: startOfMonth, $lte: endOfMonth },
      });
      const monthlySales = monthlyBills.reduce(
        (sum, b) => sum + (b.totalAmount || 0),
        0,
      );
      const monthlyBillCount = monthlyBills.length;

      // ── Total Bills ──

      const allBills = await BillingModel.find({ createdBy: userId })
        .sort({ createdAt: -1 })
        .limit(5);
      const totalBillsCount = await BillingModel.countDocuments({
        createdBy: userId,
      });
      const totalRevenue = await BillingModel.aggregate([
        { $match: { createdBy: userId } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } },
      ]);

      // ── Payment Methods Count ──

      const cashBills = await BillingModel.countDocuments({
        createdBy: userId,
        paymentMethod: "cash",
      });
      const cardBills = await BillingModel.countDocuments({
        createdBy: userId,
        paymentMethod: "card",
      });
      const onlineBills = await BillingModel.countDocuments({
        createdBy: userId,
        paymentMethod: "online",
      });

      // ── Users Count ──

      const totalUsers = await UserModel.countDocuments();
      const admins = await UserModel.countDocuments({ role: "admin" });
      const employees = await UserModel.countDocuments({ role: "employee" });
      const regularUsers = await UserModel.countDocuments({ role: "user" });

      // ── Products ──

      const totalProducts = await ProductModel.countDocuments({
        createdBy: userId,
      });
      const lowStockProducts = await ProductModel.find({
        createdBy: userId,
        stockQuantity: { $lte: 5 },
      })
        .select("title stockQuantity barcode")
        .limit(5);

      // ── Employees ──

      const totalEmployees = await EmployeeModel.countDocuments({
        user: userId,
      });
      const activeEmployees = await EmployeeModel.countDocuments({
        user: userId,
        status: "Active",
      });

      // ── Clients ──

      const totalClients = await ClientModel.countDocuments({
        createdBy: userId,
      });

      // ── Last 7 days sales (for chart) ──

      const last7Days = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const start = new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          0,
          0,
          0,
          0,
        );
        const end = new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          23,
          59,
          59,
          999,
        );

        const dayBills = await BillingModel.find({
          createdBy: userId,
          createdAt: { $gte: start, $lte: end },
        });
        const dayTotal = dayBills.reduce(
          (sum, b) => sum + (b.totalAmount || 0),
          0,
        );

        last7Days.push({
          date: start.toLocaleDateString("en-PK", { weekday: "short" }),
          sales: dayTotal,
          bills: dayBills.length,
        });
      }

      // ── Last 6 months sales (for chart) ──

      const last6Months = [];
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        const firstDay = new Date(date.getFullYear(), date.getMonth() - i, 1);
        const lastDay = new Date(
          date.getFullYear(),
          date.getMonth() - i + 1,
          0,
          23,
          59,
          59,
          999,
        );

        const mBills = await BillingModel.find({
          createdBy: userId,
          createdAt: { $gte: firstDay, $lte: lastDay },
        });
        const mTotal = mBills.reduce((sum, b) => sum + (b.totalAmount || 0), 0);

        last6Months.push({
          month: firstDay.toLocaleDateString("en-PK", { month: "short" }),
          sales: mTotal,
          bills: mBills.length,
        });
      }

      return res.status(200).json({
        success: true,
        role: "admin",
        data: {
          daily: {
            sales: dailySales,
            bills: dailyBillCount,
          },
          monthly: {
            sales: monthlySales,
            bills: monthlyBillCount,
          },
          users: {
            total: totalUsers,
            admins,
            employees,
            regularUsers,
          },
          total: {
            revenue: totalRevenue[0]?.total || 0,
            bills: totalBillsCount,
            products: totalProducts,
            employees: totalEmployees,
            activeEmployees,
            clients: totalClients,
            paymentMethods: {
              cash: cashBills,
              card: cardBills,
              online: onlineBills,
            },
          },
          recentBills: allBills,
          lowStockProducts,
          charts: {
            last7Days,
            last6Months,
          },
        },
      });
    }

    // EMPLOYEE: Billing, Products, and Employee data
    else if (user.role === "employee") {
      const dailyBills = await BillingModel.find({
        createdBy: userId,
        createdAt: { $gte: startOfDay, $lte: endOfDay },
      });
      const dailySales = dailyBills.reduce(
        (sum, b) => sum + (b.totalAmount || 0),
        0,
      );
      const dailyBillCount = dailyBills.length;

      const monthlyBills = await BillingModel.find({
        createdBy: userId,
        createdAt: { $gte: startOfMonth, $lte: endOfMonth },
      });
      const monthlySales = monthlyBills.reduce(
        (sum, b) => sum + (b.totalAmount || 0),
        0,
      );
      const monthlyBillCount = monthlyBills.length;

      const totalBillsCount = await BillingModel.countDocuments({
        createdBy: userId,
      });
      const totalRevenue = await BillingModel.aggregate([
        { $match: { createdBy: userId } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } },
      ]);

      const totalProducts = await ProductModel.countDocuments({
        createdBy: userId,
      });
      const totalEmployees = await UserModel.countDocuments({
        role: "employee",
      });

      // ── Last 7 days sales (for chart) ──

      const last7Days = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const start = new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          0,
          0,
          0,
          0,
        );
        const end = new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          23,
          59,
          59,
          999,
        );

        const dayBills = await BillingModel.find({
          createdBy: userId,
          createdAt: { $gte: start, $lte: end },
        });
        const dayTotal = dayBills.reduce(
          (sum, b) => sum + (b.totalAmount || 0),
          0,
        );

        last7Days.push({
          date: start.toLocaleDateString("en-PK", { weekday: "short" }),
          sales: dayTotal,
          bills: dayBills.length,
        });
      }

      // ── Last 6 months sales (for chart) ──

      const last6Months = [];
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        const firstDay = new Date(date.getFullYear(), date.getMonth() - i, 1);
        const lastDay = new Date(
          date.getFullYear(),
          date.getMonth() - i + 1,
          0,
          23,
          59,
          59,
          999,
        );

        const mBills = await BillingModel.find({
          createdBy: userId,
          createdAt: { $gte: firstDay, $lte: lastDay },
        });
        const mTotal = mBills.reduce((sum, b) => sum + (b.totalAmount || 0), 0);

        last6Months.push({
          month: firstDay.toLocaleDateString("en-PK", { month: "short" }),
          sales: mTotal,
          bills: mBills.length,
        });
      }

      // ── Payment Methods ──

      const cashBills = await BillingModel.countDocuments({
        createdBy: userId,
        paymentMethod: "cash",
      });
      const cardBills = await BillingModel.countDocuments({
        createdBy: userId,
        paymentMethod: "card",
      });
      const onlineBills = await BillingModel.countDocuments({
        createdBy: userId,
        paymentMethod: "online",
      });

      return res.status(200).json({
        success: true,
        role: "employee",
        data: {
          daily: {
            sales: dailySales,
            bills: dailyBillCount,
          },
          monthly: {
            sales: monthlySales,
            bills: monthlyBillCount,
          },
          total: {
            revenue: totalRevenue[0]?.total || 0,
            bills: totalBillsCount,
            products: totalProducts,
            employees: totalEmployees,
            paymentMethods: {
              cash: cashBills,
              card: cardBills,
              online: onlineBills,
            },
          },
          charts: {
            last7Days,
            last6Months,
          },
          message: "Employee access - Billing & Products with graphs",
        },
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
